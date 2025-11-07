import type { Meta, StoryObj } from '@storybook/react';
import Slideshow from './SlideShow';

const meta = {
  title: 'Components/Slideshow',
  component: Slideshow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slideshow>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
];

export const MultipleImages: Story = {
  args: {
    images: sampleImages,
  },
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
  },
};

export const TwoImages: Story = {
  args: {
    images: [sampleImages[0], sampleImages[1]],
  },
};

export const ThreeImages: Story = {
  args: {
    images: [sampleImages[0], sampleImages[1], sampleImages[2]],
  },
};
