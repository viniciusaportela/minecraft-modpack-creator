import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@nextui-org/react';
import { Types } from 'realm';
import { CaretDown, TrashSimple, Warning } from '@phosphor-icons/react';
import CurseForgeLogo from '../../../assets/curse-forge-logo.svg';
import MinecraftLogo from '../../../assets/minecraft.png';
import SKLauncherLogo from '../../../assets/sklauncher-logo.png';
import { useQueryById } from '../../../hooks/realm.hook';
import { ProjectModel } from '../../../core/models/project.model';
import capitalize from '../../../helpers/capitalize';

interface ProjectCardProps {
  title: string;
  projectId: Types.ObjectId;
  onOpen?: (projectId: Types.ObjectId) => void;
  onDelete?: (projectId: Types.ObjectId) => void;
  onOpenVersionPicker?: (projectId: Types.ObjectId, version: string) => void;
  launcher: string;
}

export default function ProjectCard({
  title,
  projectId,
  onOpen,
  onOpenVersionPicker,
  onDelete,
  launcher,
}: ProjectCardProps) {
  const project = useQueryById(ProjectModel, projectId);
  const [loadingProjectMetadata, setLoadingProjectMetadata] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setLoadingProjectMetadata(false);
    }
  }, [project]);

  console.log('ProjectCard', title, project);

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

  const internalOnDelete = () => {
    setIsPopoverOpen(false);
    onDelete?.(projectId);
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
            {capitalize(project?.loader) ?? 'Unknown'} |{' '}
            {project?.minecraftVersion ?? 'Unknown'}
          </small>
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {project?.cachedAmountInstalledMods ?? '-'} Mods
          </small>
        </Skeleton>
      </CardBody>

      <CardFooter className="flex justify-end">
        {project.launcher === 'minecraft' &&
          project.minecraftVersion !== 'unknown' && (
            <Button
              size="sm"
              className="w-16"
              isIconOnly
              onPress={() =>
                onOpenVersionPicker?.(projectId, project?.minecraftVersion)
              }
            >
              {project?.minecraftVersion}
              <CaretDown className="ml-1" />
            </Button>
          )}
        {project.loaded || project.orphan ? (
          <Popover
            backdrop="opaque"
            isOpen={isPopoverOpen}
            onOpenChange={(open) => setIsPopoverOpen(open)}
          >
            <PopoverTrigger>
              <Button size="sm" className="ml-2" isIconOnly>
                <TrashSimple />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2 flex flex-col gap-2">
                <span>
                  Are you sure you want to delete this project?
                  <br />
                  <b>You can't undo this operation</b>
                </span>
                <Button
                  size="sm"
                  color="danger"
                  onPress={() => internalOnDelete?.()}
                >
                  Confirm
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}

        <Button
          size="sm"
          color={project.loaded ? 'primary' : 'default'}
          className="ml-2"
          isDisabled={project.orphan}
          onPress={() => onOpen?.(projectId)}
        >
          {project.loaded ? 'Open' : 'Create'}
        </Button>
      </CardFooter>
    </Card>
  );
}
