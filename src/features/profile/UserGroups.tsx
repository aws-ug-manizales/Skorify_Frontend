type Group = {
  id: number;
  name: string;
  members: number;
};

type Props = {
  groups?: Group[];
};

const UserGroups = ({ groups = [] }: Props) => {
  if (groups.length === 0) {
    return (
      <div
        style={{
          background: '#15151f',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '18px',
          color: '#9ca3af',
          textAlign: 'center',
        }}
      >
        No perteneces a ningún grupo de apuestas del Mundial.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '16px',
        maxWidth: '980px',
        margin: '0 auto',
      }}
    >
      {groups.map((group) => (
        <div
          key={group.id}
          style={{
            background: '#15151f',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px',
            minHeight: '145px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(0,0,0,0.22)',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                lineHeight: 1.4,
              }}
            >
              {group.name}
            </h3>

            <p
              style={{
                marginTop: '10px',
                marginBottom: 0,
                color: '#b4b4c5',
                fontSize: '13px',
              }}
            >
              {group.members} participantes
            </p>
          </div>

          <button
            type="button"
            style={{
              width: '100%',
              marginTop: '16px',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 12px',
              background: 'linear-gradient(90deg, #9333ea, #f97316)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.11em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 18px rgba(249,115,22,0.18)',
            }}
          >
            Ver grupos
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserGroups;
