import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Skeleton,
} from '@nextui-org/react';
import { Types } from 'realm';
import { Warning } from '@phosphor-icons/react';
import CurseForgeLogo from '../../../assets/curse-forge-logo.svg';
import MinecraftLogo from '../../../assets/minecraft.png';
import SKLauncherLogo from '../../../assets/sklauncher-logo.png';
import { useQueryById } from '../../../hooks/realm.hook';
import { ProjectModel } from '../../../core/models/project.model';

interface ProjectCardProps {
  title: string;
  projectId: Types.ObjectId;
  onOpen?: (projectId: Types.ObjectId) => void;
  launcher: string;
}

export default function ProjectCard({
  title,
  projectId,
  onOpen,
  launcher,
}: ProjectCardProps) {
  const project = useQueryById(ProjectModel, projectId);
  const [loadingProjectMetadata, setLoadingProjectMetadata] = useState(true);

  useEffect(() => {
    if (project) {
      setLoadingProjectMetadata(false);
    }
  }, [project]);

  if (!project) {
    return null;
  }

  const getLauncherLogo = () => {
    const logoByLauncher = {
      minecraft: MinecraftLogo,
      curseforge: CurseForgeLogo,
      sklauncher: SKLauncherLogo,
    };

    return (
      logoByLauncher[launcher as keyof typeof logoByLauncher] ?? MinecraftLogo
    );
  };

  const getNameByLauncher = () => {
    const nameByLauncher = {
      minecraft: 'Minecraft',
      curseforge: 'CurseForge',
      sklauncher: 'SKLauncher',
    };

    return (
      nameByLauncher[launcher as keyof typeof nameByLauncher] ?? 'Minecraft'
    );
  };

  const getColorByLauncher = () => {
    const colorByLauncher = {
      minecraft: 'success',
      curseforge: 'warning',
      sklauncher: 'primary',
    } as const;

    return (
      colorByLauncher[launcher as keyof typeof colorByLauncher] ?? 'primary'
    );
  };

  return (
    <Card className="h-44 w-80">
      <CardBody className="pb-0 pt-5 px-4 flex-col items-start">
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <h4 className="font-bold text-large">{title}</h4>
          {project.orphan ? (
            <Chip
              variant="flat"
              size="sm"
              color="danger"
              className="mb-2"
              startContent={<Warning className="text-danger" />}
            >
              This folder doesn't exists anymore
            </Chip>
          ) : (
            <Chip
              variant="flat"
              size="sm"
              color={getColorByLauncher()}
              className="mb-2"
              startContent={
                <Image src={getLauncherLogo()} width={20} height={20} />
              }
            >
              {getNameByLauncher()}
            </Chip>
          )}
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {project?.loader ?? 'Unknown'} |{' '}
            {project?.minecraftVersion ?? 'Unknown'}
          </small>
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {project?.cachedAmountInstalledMods ?? '-'} Mods
          </small>
        </Skeleton>
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          size="sm"
          color="primary"
          className="ml-auto"
          isDisabled={project.orphan}
          onPress={() => onOpen?.(projectId)}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
