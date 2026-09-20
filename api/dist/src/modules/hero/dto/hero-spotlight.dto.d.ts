export declare enum HeroPriority {
    P0 = "P0",
    P1 = "P1",
    P2 = "P2",
    P3 = "P3",
    P4 = "P4",
    P5 = "P5"
}
export declare enum HeroLifecycleState {
    ANNOUNCEMENT = "Announcement",
    APPLICATIONS_OPEN = "Applications Open",
    URGENCY = "Urgency",
    LIVE = "Live",
    COMPLETED = "Completed",
    STORIES = "Stories"
}
export declare class HeroVisualAssetsDto {
    videoDesktopUrl?: string;
    videoMobileUrl?: string;
    staticDesktopUrl: string;
    staticMobileUrl: string;
}
export declare class CreateHeroSpotlightDto {
    title: string;
    priority: HeroPriority;
    lifecycleState: HeroLifecycleState;
    headline: string;
    shortContext: string;
    statusTag?: string;
    visualAssets: HeroVisualAssetsDto;
    primaryCta: {
        label: string;
        url: string;
    };
    secondaryCta?: {
        label: string;
        url: string;
    };
    startsAt?: string;
    expiresAt?: string;
    isActive?: boolean;
}
export declare class UpdateHeroSpotlightDto extends CreateHeroSpotlightDto {
}
