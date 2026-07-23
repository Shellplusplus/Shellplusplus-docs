// @ts-nocheck
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../--log-level';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();