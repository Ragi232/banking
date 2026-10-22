import { IconName } from '../components/Button';
import { Category } from '../types';

export const categoryIcon: Record<Category, IconName> = {
  Food: 'restaurant',
  Transport: 'car',
  Shopping: 'bag',
  Bills: 'receipt',
  Entertainment: 'film',
  Transfer: 'swap-horizontal',
  Income: 'arrow-down-circle',
};

/** Chart palette; every slice is also labelled in a legend (not color-only). */
export const chartPalette = ['#D32F2F', '#37474F', '#F9A825', '#1E88E5', '#8E24AA', '#00897B'];
