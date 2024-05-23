import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import type { PolicyHandler } from '../../casl/interfaces/IPolicyHandler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]): CustomDecorator =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
