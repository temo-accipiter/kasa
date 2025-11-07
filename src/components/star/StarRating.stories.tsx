import type { Meta, StoryObj } from '@storybook/react';
import StarRating from './StarRating';

const meta = {
  title: 'Components/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'select' },
      options: ['1', '2', '3', '4', '5'],
    },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneStar: Story = {
  args: {
    rating: '1',
  },
};

export const TwoStars: Story = {
  args: {
    rating: '2',
  },
};

export const ThreeStars: Story = {
  args: {
    rating: '3',
  },
};

export const FourStars: Story = {
  args: {
    rating: '4',
  },
};

export const FiveStars: Story = {
  args: {
    rating: '5',
  },
};

export const ZeroStars: Story = {
  args: {
    rating: '0',
  },
};
