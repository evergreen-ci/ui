import { DetailsCard, DoesNotExpire } from "components/Spawn";
import { useDateFormat } from "hooks";
import { TableVolume } from "types/spawn";

interface Props {
  volume: TableVolume;
}

export const SpawnVolumeCard: React.FC<Props> = ({ volume }) => (
  <DetailsCard
    data-cy={`spawn-volume-card-${volume.displayName || volume.id}`}
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    fieldMaps={spawnVolumeCardFields}
    type={volume}
  />
);

const VolumeCreationTime: React.FC<TableVolume> = ({ creationTime }) => {
  const getDateCopy = useDateFormat();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return <>{getDateCopy(creationTime)}</>;
};

const VolumeExpiration: React.FC<TableVolume> = ({
  expiration,
  noExpiration,
}) => {
  const getDateCopy = useDateFormat();
  return (
    <span>
      {noExpiration || !expiration ? DoesNotExpire : getDateCopy(expiration)}
    </span>
  );
};

const spawnVolumeCardFields = {
  "Availability Zone": (volume: TableVolume) => (
    <span>{volume.availabilityZone}</span>
  ),
  "Created at": VolumeCreationTime,
  "Expires at": VolumeExpiration,
  "Is Home Volume": (volume: TableVolume) => (
    <span>{volume.homeVolume ? "True" : "False"}</span>
  ),
  Size: (volume: TableVolume) => <span>{volume.size} GB</span>,
  Type: (volume: TableVolume) => <span>{volume.type}</span>,
};
