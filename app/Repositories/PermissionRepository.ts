import Permission from "App/Models/Permission";

export default class PermissionRepository {
  public async getAll(filters: any) {
    const { include, sort } = filters;

    const query = Permission.query();

    if (include !== "all") {
      query.where("status", true);
    }

    if (sort) {
      if (sort.startsWith("-")) {
        query.orderBy(sort.substring(1), "desc");
      } else {
        query.orderBy(sort, "asc");
      }
    }

    return await query;
  }

  public async findByKey(key: string) {
    const permission = await Permission.query().where("key", key).first();
    if (!permission) {
      throw new Error("PERMISSION NOT FOUND");
    }
    return permission;
  }

  public async createPermission(data: any) {
    const exists = await Permission.query().where("key", data.key).first();

    if (exists) {
      throw new Error("Permission already exists");
    }

    return await Permission.create(data);
  }

  public async updatePermission(key: string, data: any) {
    const permission = await this.findByKey(key);

    if (!permission) {
      throw new Error("PERMISSION NOT FOUND");
    }

    permission.merge(data);

    await permission.save();

    return permission;
  }

  public async disablePermission(key: string) {
    const permission = await this.findByKey(key);

    if (!permission) {
      throw new Error("PERMISSION NOT FOUND");
    }
    permission.status = false;

    await permission.save();

    return permission;
  }
  public async enablePermission(key: string) {
    const permission = await this.findByKey(key);

    if (!permission) {
      throw new Error("PERMISSION NOT FOUND");
    }

    permission.status = true;

    await permission.save();

    return permission;
  }
}
