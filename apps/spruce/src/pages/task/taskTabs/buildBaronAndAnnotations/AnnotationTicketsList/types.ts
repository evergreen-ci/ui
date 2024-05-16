import { IssuesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

// @ts-ignore: FIXME. This comment was added by an automated script.
type AnnotationTickets = IssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = Unpacked<AnnotationTickets>;

export type { AnnotationTickets, AnnotationTicket };
