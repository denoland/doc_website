import React from "react";
import { TsTypeDef, findNodeByType } from "../util/docs";
import { useNodes } from "../util/nodes";
import { Link } from "./Link";

export const TsType = ({ tsType }: { tsType: TsTypeDef }) => {
  const nodes = useNodes();
  const node = findNodeByType(nodes, tsType);
  return node ? (
    <Link href={`#${node.kind}.${node.name}`} className="text-blue-500">
      {tsType.repr}
    </Link>
  ) : (
    <span>{tsType.repr}</span>
  );
};
