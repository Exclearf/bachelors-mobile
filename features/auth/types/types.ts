import { JwtPayload } from "jwt-decode";
import { ImageSourcePropType } from "react-native";

export type UserPicture =
  | ImageSourcePropType
  | {
      uri: string;
    };

export type User = {
  name: string;
  email: string;
  picture: UserPicture;
};

export interface SupabaseJwt extends JwtPayload {
  exp: number;
}
