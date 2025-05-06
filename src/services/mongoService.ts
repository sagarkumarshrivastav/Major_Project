
export const getItemById = async (id: string): Promise<Item | undefined> => {
  await initMongo();
  const db = getDb();
  
  // Try to find in lost items
  let item = await db.collection(collections.lostItems).findOne({
    _id: new ObjectId(id),
  });
  
  // If not found, try found items
  if (!item) {
    item = await db.collection(collections.foundItems).findOne({
      _id: new ObjectId(id),
    });
  }
  
  if (!item) {
    return undefined;
  }
  
  return {
    ...item,
    id: item._id.toString(),
  } as Item; // Explicitly cast to Item type
};
