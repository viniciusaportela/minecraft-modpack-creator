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
import CurseForgeLogo from '../../../assets/curse-forge-logo.svg';
import MinecraftLogo from '../../../assets/minecraft.png';
import { useQueryById } from '../../../hooks/realm.hook';
import { ProjectModel } from '../../../core/models/project.model';

interface ProjectCardProps {
  title: string;
  projectId: Types.ObjectId;
  onOpen?: (projectId: Types.ObjectId) => void;
  isCurseForge?: boolean;
}

export default function ProjectCard({
  title,
  projectId,
  onOpen,
  isCurseForge,
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

  return (
    <Card className="h-44 w-80">
      <CardBody className="pb-0 pt-5 px-4 flex-col items-start">
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <h4 className="font-bold text-large">{title}</h4>
          <Chip
            variant="flat"
            size="sm"
            color="warning"
            className="mb-2"
            startContent={
              <Image
                src={isCurseForge ? CurseForgeLogo : MinecraftLogo}
                width={20}
                height={20}
              />
            }
          >
            {isCurseForge ? 'CurseForge' : 'Minecraft'}
          </Chip>
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {project?.loader ?? ''} | {project?.minecraftVersion ?? ''}
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
          onPress={() => onOpen?.(projectId)}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
