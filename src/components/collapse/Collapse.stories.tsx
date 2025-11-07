import type { Meta, StoryObj } from '@storybook/react';
import Collapse from './Collapse';

const meta = {
  title: 'Components/Collapse',
  component: Collapse,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Description',
    children: (
      <p>
        Vous serez à 50m du canal Saint-martin où vous pourrez pique-niquer l&apos;été
        et à côté de nombreux bars et restaurants. Au coeur de Paris avec 5 lignes de
        métro et de bus à proximité, vous pourrez accéder à toute la ville en moins de
        30 minutes.
      </p>
    ),
  },
};

export const WithList: Story = {
  args: {
    title: 'Équipements',
    children: (
      <ul>
        <li>Climatisation</li>
        <li>Wi-Fi</li>
        <li>Cuisine</li>
        <li>Espace de travail</li>
        <li>Fer à repasser</li>
        <li>Sèche-cheveux</li>
        <li>Cintres</li>
      </ul>
    ),
  },
};

export const ShortContent: Story = {
  args: {
    title: 'Fiabilité',
    children: <p>Les annonces postées sur Kasa garantissent une fiabilité totale.</p>,
  },
};

export const LongContent: Story = {
  args: {
    title: 'À propos',
    children: (
      <div>
        <p>
          Kasa vous propose des annonces de location d&apos;appartements entre
          particuliers depuis près de 10 ans maintenant. Kasa, c&apos;est la garantie
          d&apos;annonces fiables et sérieuses.
        </p>
        <p>
          Les annonces postées sur Kasa garantissent une fiabilité totale. Les photos
          sont conformes aux logements, et toutes les informations sont régulièrement
          vérifiées par nos équipes.
        </p>
        <p>
          Notre plateforme est pensée pour vous offrir la meilleure expérience possible
          dans votre recherche de logement. Que vous soyez à la recherche d&apos;un
          studio cosy en centre-ville ou d&apos;une grande maison à la campagne, vous
          trouverez forcément votre bonheur sur Kasa.
        </p>
      </div>
    ),
  },
};

export const WithImages: Story = {
  args: {
    title: 'Galerie',
    children: (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200"
          alt="Apartment 1"
          style={{ borderRadius: '10px', width: '200px' }}
        />
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200"
          alt="Apartment 2"
          style={{ borderRadius: '10px', width: '200px' }}
        />
      </div>
    ),
  },
};
