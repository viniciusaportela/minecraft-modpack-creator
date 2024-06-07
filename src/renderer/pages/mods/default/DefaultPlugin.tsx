import { TreePalm } from '@phosphor-icons/react';
import { IModPageProps } from '../../../typings/plugin.interface';

// eslint-disable-next-line no-empty-pattern
export default function DefaultPlugin({}: IModPageProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <TreePalm size={24} className="mb-2 text-zinc-700" />
      <i className="text-zinc-700">Nothing to see here at the moment</i>
    </div>
  );
}
