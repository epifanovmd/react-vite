import type { INodeMeshCellDto } from "./iNodeMeshCellDto.ts";
import type { INodeMeshNodeDto } from "./iNodeMeshNodeDto.ts";

/**
 * Матрица связности узлов.
 */
export interface INodeMeshDto {
  nodes: INodeMeshNodeDto[];
  cells: INodeMeshCellDto[];
  /** Когда собрана, мс. */
  generatedAt: number;
}
