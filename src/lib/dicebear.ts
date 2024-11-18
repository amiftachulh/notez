import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export function generateAvatar(seed?: string) {
  const avatar = createAvatar(botttsNeutral, {
    seed,
  });
  return avatar.toDataUri();
}
