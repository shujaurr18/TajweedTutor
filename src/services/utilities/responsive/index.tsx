import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');

export const responsiveWidth = (percentage: number): number => {
  return (percentage * window.width) / 100;
};

export const responsiveHeight = (percentage: number): number => {
  return (percentage * window.height) / 100;
};

export const responsiveFontSize = (size: number): number => {
  // Use a more reasonable scaling approach
  const scaleFactor = Math.min(window.width / 375, window.height / 667);
  const adjustedSize = Math.max(size * scaleFactor, size * 0.8); // Ensure minimum readable size
  return PixelRatio.roundToNearestPixel(adjustedSize);
};
