export default class Snowflake {
    private static lastTimestamp = 0;
    private static sequence = 0;

    public static async generate(): Promise<bigint> {
        let timestamp = Date.now();

        if (timestamp === Snowflake.lastTimestamp) {
            Snowflake.sequence = (Snowflake.sequence + 1) & 0xFFFF; // Increment sequence and ensure it stays within 16 bits
            if (Snowflake.sequence === 0) {
                // Wait for the next millisecond if sequence overflows
                // Use async wait instead of busy-wait to avoid blocking the event loop
                // Calculate delay at the time of setTimeout to avoid race conditions
                await new Promise(resolve => {
                    setTimeout(resolve, Math.max(0, Snowflake.lastTimestamp + 1 - Date.now()));
                });
                timestamp = Date.now();
            }
        } else {
            Snowflake.sequence = 0; // Reset sequence for a new timestamp
        }

        Snowflake.lastTimestamp = timestamp;
        const snowflakeId = BigInt(timestamp) << BigInt(22) | BigInt(Snowflake.sequence);
        return snowflakeId;
    }
}