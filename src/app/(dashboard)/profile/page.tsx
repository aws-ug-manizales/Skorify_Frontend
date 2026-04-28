import UserGroups from '@/features/profile/UserGroups';

const ProfilePage = () => {
  const groups = [
    { id: 1, name: 'Apuestas Mundial 2026', members: 128 },
    { id: 2, name: 'Predicciones Fase de Grupos', members: 74 },
    { id: 3, name: 'Quiniela Mundialista', members: 56 },
    { id: 4, name: 'Retos Goleador del Mundial', members: 91 },
    { id: 5, name: 'Marcador Exacto', members: 42 },
    { id: 6, name: 'Campeón del Mundial', members: 110 },
    { id: 7, name: 'Goleador del Torneo', members: 87 },
    { id: 8, name: 'Apuestas Eliminatorias', members: 63 },
    { id: 9, name: 'Final Mundialista', members: 95 },
  ];

  return (
    <div
      style={{
        width: '100%',
        padding: '32px 24px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <h2
            style={{
              marginTop: '22px',
              marginBottom: 0,
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            Mis grupos de apuestas
          </h2>
        </div>

        <UserGroups groups={groups} />
      </div>
    </div>
  );
};

export default ProfilePage;
