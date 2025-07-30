import { Payment } from "../payments/Payment";
import { Team } from "../Team";
import { User } from "../User";

export type PaymentDTO =
  | {
      type: Payment.UPGRADE_TEAM;
      id: Team["id"];
    }
  | {
      type: Payment.UPGRADE_USER;
      id: User["id"];
    };
