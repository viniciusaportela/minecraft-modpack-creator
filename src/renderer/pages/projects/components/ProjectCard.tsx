import React, { useState } from 'react';
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
import { CaretDown, TrashSimple, Warning } from '@phosphor-icons/react';
import CurseForgeLogo from '../../../assets/curse-forge-logo.svg';
import MinecraftLogo from '../../../assets/minecraft.png';
import SKLauncherLogo from '../../../assets/sklauncher-logo.png';
import capitalize from '../../../helpers/capitalize';
import { useAppStore } from '../../../store/app.store';

interface ProjectCardProps {
  title: string;
  projectIdx: number;
  onOpen?: (projectIdx: number) => void;
  onDelete?: (projectIdx: number) => void;
  onOpenVersionPicker?: (projectIdx: number, version: string) => void;
  launcher: string;
}

export default function ProjectCard({
  title,
  projectIdx,
  onOpen,
  onOpenVersionPicker,
  onDelete,
  launcher,
}: ProjectCardProps) {
  const project = useAppStore((st) => st.projects[projectIdx]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
    onDelete?.(projectIdx);
  };

  return (
    <Card className="h-44 w-80">
      <CardBody className="pb-0 pt-5 px-4 flex-col items-start">
        <Skeleton>
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
        <Skeleton>
          <small className="text-sm">
            {capitalize(project?.loader) ?? 'Unknown'} |{' '}
            {project?.minecraftVersion ?? 'Unknown'}
          </small>
        </Skeleton>
        <Skeleton>
          <small className="text-sm">{project?.modCount ?? '-'} Mods</small>
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
                onOpenVersionPicker?.(projectIdx, project?.minecraftVersion)
              }
            >
              {project?.minecraftVersion}
              <CaretDown className="ml-1" />
            </Button>
          )}
        {project.isLoaded || project.orphan ? (
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
          color={project.isLoaded ? 'primary' : 'default'}
          className="ml-2"
          isDisabled={project.orphan}
          onPress={() => onOpen?.(projectIdx)}
        >
          {project.isLoaded ? 'Open' : 'Create'}
        </Button>
      </CardFooter>
    </Card>
  );
}
