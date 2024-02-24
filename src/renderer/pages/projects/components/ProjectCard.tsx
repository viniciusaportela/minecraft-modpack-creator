import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from '@nextui-org/react';
import { IProjectMeta } from '../../../typings/project-meta.interface';

interface ProjectCardProps {
  title: string;
  path: string;
  onOpen?: (path: string, projectMeta: IProjectMeta | null) => void;
}

export default function ProjectCard({ title, path, onOpen }: ProjectCardProps) {
  const [projectMetadata, setProjectMetadata] = useState<IProjectMeta | null>(
    null,
  );
  const [loadingProjectMetadata, setLoadingProjectMetadata] = useState(true);

  useEffect(() => {
    console.log(path);
    window.ipcRenderer
      .invoke('readFile', `${path}/minecraftinstance.json`)
      .then((data) => {
        const res = JSON.parse(data);
        setProjectMetadata(res);
      })
      .catch((err) => err)
      .finally(() => setLoadingProjectMetadata(false));
  }, []);

  return (
    <Card className="h-44 w-80">
      <CardHeader className="pb-0 pt-5 px-4 flex-col items-start">
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <h4 className="font-bold text-large">{title}</h4>
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {projectMetadata?.baseModLoader?.name} |{' '}
            {projectMetadata?.gameVersion}
          </small>
        </Skeleton>
        <Skeleton isLoaded={!loadingProjectMetadata}>
          <small className="text-sm">
            {projectMetadata?.installedAddons.length} Mods
          </small>
        </Skeleton>
      </CardHeader>
      <CardBody className="flex flex-1" />
      <CardFooter className="flex justify-between">
        <Button
          size="sm"
          color="primary"
          className="ml-auto"
          onPress={() => onOpen?.(path, projectMetadata)}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
}
