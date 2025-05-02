export default class Snowflake {
    private static lastTimestamp = 0;
    private static sequence = 0;

    public static generate(): bigint {
        const timestamp = Date.now();

        if (timestamp === Snowflake.lastTimestamp) {
            Snowflake.sequence = (Snowflake.sequence + 1) & 0xFFFF; // Increment sequence and ensure it stays within 16 bits
            if (Snowflake.sequence === 0) {
                // Wait for the next millisecond if sequence overflows
                while (Date.now() <= Snowflake.lastTimestamp) {}
            }
        } else {
            Snowflake.sequence = 0; // Reset sequence for a new timestamp
        }

        Snowflake.lastTimestamp = timestamp;
        const snowflakeId = BigInt(timestamp) << BigInt(22) | BigInt(Snowflake.sequence);
        return snowflakeId;
    }
}