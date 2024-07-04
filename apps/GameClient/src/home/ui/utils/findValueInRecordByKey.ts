export function findValueInRecordByKey<Key extends string, Value>(
  record: Record<Key, Value>,
  key: Key
): Value | undefined {
  return record[key];
}
