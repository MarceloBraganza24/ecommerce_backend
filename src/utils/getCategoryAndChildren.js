// utils/getCategoryAndChildren.js
import {categoriesModel} from "../dao/dbManagers/models/categories.model.js";

export async function getCategoryAndChildrenIds(categoryId) {
  const categoriesToProcess = [categoryId];
  const allIds = [categoryId];

  while (categoriesToProcess.length > 0) {
    const currentId = categoriesToProcess.pop();

    const children = await categoriesModel
      .find({ parent: currentId })
      .select("_id");

    for (const child of children) {
      allIds.push(child._id.toString());
      categoriesToProcess.push(child._id.toString());
    }
  }

  return allIds;
}
