import React from "react";
import { TsTypeDef } from "../util/docs";

export const TsType = ({
  tsType: tsType_
}: {
  tsType: TsTypeDef;
}) => {
  return (
    <span>{JSON.stringify(tsType_)}</span>
  );
};
