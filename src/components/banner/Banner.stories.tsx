import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Banner from './Banner';
import landscapeImage from '../../assets/landscape.png';
import coastImage from '../../assets/coast.png';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomePageBanner: Story = {
  args: {
    image: landscapeImage,
    alt: 'Paysage côtier avec falaises',
    text: 'Chez vous, partout et ailleurs',
  },
};

export const AboutPageBanner: Story = {
  args: {
    image: coastImage,
    alt: 'Côte montagneuse',
  },
};

export const WithoutText: Story = {
  args: {
    image: coastImage,
    alt: 'Bannière sans texte',
  },
};

export const CustomText: Story = {
  args: {
    image: landscapeImage,
    alt: 'Bannière personnalisée',
    text: 'Bienvenue sur Kasa',
  },
};
