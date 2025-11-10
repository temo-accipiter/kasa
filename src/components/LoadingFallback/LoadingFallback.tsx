import { useTranslation } from 'react-i18next';

export default function LoadingFallback() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {t('loading')}
    </div>
  );
}
