"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
async function runMigrationForDb(dbUrl, dbName, migrationFile) {
    if (!dbUrl) {
        console.log(`[Migration] No database URL provided for ${dbName}. Skipping migration.`);
        return;
    }
    console.log(`[Migration] Running migration for ${dbName}...`);
    const pool = new pg_1.Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
    });
    try {
        const client = await pool.connect();
        try {
            const sqlPath = path.resolve(__dirname, 'migrations', migrationFile);
            const fallbackSqlPath = path.resolve(__dirname, '../../database/migrations', migrationFile);
            let sql;
            if (fs.existsSync(sqlPath)) {
                sql = fs.readFileSync(sqlPath, 'utf8');
            }
            else if (fs.existsSync(fallbackSqlPath)) {
                sql = fs.readFileSync(fallbackSqlPath, 'utf8');
            }
            else {
                throw new Error(`Migration file not found: ${migrationFile}`);
            }
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
            console.log(`[Migration] Migration ${migrationFile} for ${dbName} completed successfully.`);
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    finally {
        await pool.end();
    }
}
async function migrate() {
    const coreUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
    const formsUrl = process.env.FORMS_DATABASE_DIRECT_URL || process.env.FORMS_DATABASE_URL;
    try {
        await runMigrationForDb(coreUrl, 'Core Neon DB', '001_core_schema.sql');
        await runMigrationForDb(formsUrl, 'Forms Neon DB', '002_forms_schema.sql');
        console.log('[Migration] All migrations completed.');
        process.exit(0);
    }
    catch (error) {
        console.error('[Migration] Migration failed:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    migrate();
}
//# sourceMappingURL=migrate.js.map