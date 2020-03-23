import React from "react";
import { TsTypeDef } from "../util/docs";

export const TsType = ({ tsType }: { tsType: TsTypeDef }) => {
  return <span>{tsType.repr}</span>;
};
