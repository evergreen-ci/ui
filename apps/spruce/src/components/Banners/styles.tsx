import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cx } from "@evg-ui/lib/utils/css";
import styles from "./styles.module.css";

const BannerContainer = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.bannerContainer, className)} {...rest} />
));
BannerContainer.displayName = "BannerContainer";

const TitleWrapper = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cx(styles.titleWrapper, className)} {...rest} />
));
TitleWrapper.displayName = "TitleWrapper";

const OrderedList = forwardRef<
  HTMLOListElement,
  ComponentPropsWithoutRef<"ol">
>(({ className, ...rest }, ref) => (
  <ol ref={ref} className={cx(styles.orderedList, className)} {...rest} />
));
OrderedList.displayName = "OrderedList";

const ListItem = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<"li">>(
  ({ className, ...rest }, ref) => (
    <li ref={ref} className={cx(styles.listItem, className)} {...rest} />
  ),
);
ListItem.displayName = "ListItem";

const ModalTriggerText = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    className={cx(styles.modalTriggerText, className)}
    {...rest}
  />
));
ModalTriggerText.displayName = "ModalTriggerText";

export {
  BannerContainer,
  TitleWrapper,
  OrderedList,
  ListItem,
  ModalTriggerText,
};
