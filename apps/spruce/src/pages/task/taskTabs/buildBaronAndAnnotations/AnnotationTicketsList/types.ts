import { IssuesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

// @ts-expect-error: FIXME. This comment was added by an automated script.
type AnnotationTickets = IssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = Unpacked<AnnotationTickets>;

export type { AnnotationTickets, AnnotationTicket };
