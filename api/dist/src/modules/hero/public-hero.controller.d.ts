import { HeroService } from './hero.service';
export declare class PublicHeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    getActiveHero(): Promise<{
        isEvergreen: boolean;
        id: any;
        title: any;
        priority: any;
        lifecycleState: any;
        headline: any;
        shortContext: any;
        statusTag: any;
        visualAssets: any;
        primaryCta: any;
        secondaryCta: any;
        publishedAt: any;
    } | {
        isEvergreen: boolean;
        priority: string;
        lifecycleState: import("./dto/hero-spotlight.dto").HeroLifecycleState;
        headline: string;
        shortContext: string;
        statusTag: string;
        primaryCta: {
            label: string;
            url: string;
        };
        secondaryCta: {
            label: string;
            url: string;
        };
        visualAssets: {
            staticDesktopUrl: string;
            staticMobileUrl: string;
        };
        id?: undefined;
        title?: undefined;
        publishedAt?: undefined;
    }>;
}
