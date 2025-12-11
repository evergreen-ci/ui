import React, {
  useEffect,
  useRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

interface AnimatedIconProps {
  icon: ForwardRefExoticComponent<
    RefAttributes<SVGSVGElement> & {
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
    }
  >;
  alwaysAnimate?: boolean;
}

/**
 * `AnimatedIcon` is a component that wraps an SVG icon and adds mouse enter and mouse leave events to pause and unpause animations.
 * @param props - The props for the `AnimatedIcon` component.
 * @param props.icon - The SVG icon to animate.
 * @param props.alwaysAnimate - Whether the icon should always animate or not. Defaults to false.
 * @returns - A React component that wraps an SVG icon and adds mouse enter and mouse leave events to pause and unpause animations.
 */
const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  alwaysAnimate = false,
  icon,
  ...rest
}) => {
  const iconRef = useRef<SVGSVGElement>(null);
  // Animations should be paused by default on page load.
  useEffect(() => {
    // Check if the SVG has animations before pausing them.
    // This is necessary because some SVGs may not have animations.
    //  and calling pauseAnimations on an SVG without animations will throw an error.
    if (iconRef.current && hasAnimations(iconRef.current) && !alwaysAnimate) {
      iconRef.current?.pauseAnimations();
    }
  }, [alwaysAnimate]);

  const onMouseEnter = () => {
    if (hasAnimations(iconRef.current!) && !alwaysAnimate) {
      iconRef.current?.unpauseAnimations();
    }
  };

  const onMouseLeave = () => {
    if (hasAnimations(iconRef.current!) && !alwaysAnimate) {
      iconRef.current?.pauseAnimations();
    }
  };

  const Icon = icon;
  return (
    <Icon
      ref={iconRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    />
  );
};

/**
 * `hasAnimations` checks if an SVG element has animations. This is used to determine if the SVG can be paused and unpaused.
 * @param svgElement - The SVG element to check for animations.
 * @returns - A boolean indicating if the SVG element has animations.
 */
const hasAnimations = (svgElement: SVGSVGElement): boolean =>
  svgElement.querySelector("animate, animateTransform, animateMotion") !== null;

export default AnimatedIcon;
