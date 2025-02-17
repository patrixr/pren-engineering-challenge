import { Profile } from "../entity/profile";
import { SerializedRecord } from "./base";

type SerializedProfile = SerializedRecord<{
  profileId: string;
  name: string;
}>;

export function serializeProfile(
  profile: Profile,
  include: string[] = [],
): SerializedProfile {
  const record: SerializedProfile = {
    id: profile.profileId,
    type: "profile",
  };

  if (include.length) {
    record.attributes = include.reduce(
      (acc, key) => {
        if (key in profile) {
          acc[key] = profile[key as keyof Profile];
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return record;
}
