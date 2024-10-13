export type Event = {
    title: string;
    description: string;
    date: Date;
    dateEnd: Date | undefined;
    activeReminder: boolean;
};
export type DatabaseEvents = {
    id: number;
    title: string;
    date: string;
    description: string | null;
    dateEnd: string | null;
    activeReminder: boolean | null;
    sharedTo: string | null;
    sharedFrom: string | null;
    actions: string | null;
} | undefined