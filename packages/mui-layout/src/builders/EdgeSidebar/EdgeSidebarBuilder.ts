import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { normalizeMapById } from '../../utils';
import {
  EdgeSidebarConfig,
  IEdgeSidebarBuilder,
  IEdgeSidebarRegistry,
  EdgeSidebarConfigMapById,
} from '../../types';

export const isUniqueSidebars = (
  sidebars: Pick<EdgeSidebarConfig, 'id'>[]
): boolean => {
  const keys: string[] = [];
  let isUnique = true;
  sidebars.forEach(({ id }) => {
    if (!id) {
      throw new Error('[Layout] - All Sidebar must have id');
    }
    if (keys.includes(id)) {
      isUnique = false;
    } else {
      keys.push(id);
    }
  });
  return isUnique;
};

export default (): IEdgeSidebarBuilder => {
  const sidebarIds: string[] = [];
  const mapById: EdgeSidebarConfigMapById = {};
  const addConfig = (
    breakpoint: Breakpoint,
    config: EdgeSidebarConfig
  ): void => {
    if (!sidebarIds.includes(config.id)) {
      sidebarIds.push(config.id);
    }

    if (!mapById[config.id]) {
      mapById[config.id] = {};
    }
    mapById[config.id][breakpoint] = config;
  };
  return {
    create(id, props) {
      const Registry = (): IEdgeSidebarRegistry => ({
        registerPersistentConfig(breakpoint, config) {
          addConfig(breakpoint, {
            ...config,
            ...props,
            id,
            variant: 'persistent',
          });
          return this;
        },
        registerPermanentConfig(breakpoint, config) {
          addConfig(breakpoint, {
            ...config,
            ...props,
            id,
            variant: 'permanent',
          });
          return this;
        },
        registerTemporaryConfig(breakpoint, config) {
          addConfig(breakpoint, {
            ...config,
            ...props,
            id,
            variant: 'temporary',
          });
          return this;
        },
      });
      return Registry();
    },
    update(id, updater) {
      if (mapById[id]) {
        updater(mapById[id]);
      } else {
        console.warn(`No sidebar to update. id: ${id}`);
      }
    },
    getData() {
      return {
        sidebarIds,
        configMap: normalizeMapById(mapById),
        configMapById: mapById,
      };
    },
    getSidebarIds: () => sidebarIds,
  };
};