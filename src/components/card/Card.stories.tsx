import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Card from './Card';
import { Logement } from '../../types';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ maxWidth: '340px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAccommodation: Logement = {
  id: '1',
  title: 'Appartement cosy',
  cover: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  pictures: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
  description: 'Un bel appartement dans le centre-ville',
  host: {
    name: 'Jean Dupont',
    picture: 'https://i.pravatar.cc/150?img=1',
  },
  rating: '4',
  location: 'Paris, France',
  equipments: ['Wi-Fi', 'Cuisine équipée'],
  tags: ['Cosy', 'Centre-ville'],
};

export const Default: Story = {
  args: {
    item: mockAccommodation,
  },
};

export const LongTitle: Story = {
  args: {
    item: {
      ...mockAccommodation,
      title: 'Magnifique appartement avec une vue imprenable sur la ville',
    },
  },
};

export const BeachHouse: Story = {
  args: {
    item: {
      ...mockAccommodation,
      id: '2',
      title: 'Villa en bord de mer',
      cover: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400',
    },
  },
};

export const MountainChalet: Story = {
  args: {
    item: {
      ...mockAccommodation,
      id: '3',
      title: 'Chalet à la montagne',
      cover: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400',
    },
  },
};
