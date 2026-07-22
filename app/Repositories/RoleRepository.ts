import Role from "App/Models/Role";
export default class RoleRepository {
  public async getAll(filters: any) {
    const { include, sort } = filters;

    const query = Role.query();

    // .preload('permissions')

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
    const role = await Role.query().where("key", key).first();
    if (!role) {
      throw new Error("ROLE NOT FOUND");
    }
    return role;
  }

  public async createRole(data: any) {
    const exists = await Role.query().where("key", data.key).first();

    if (exists) {
      throw new Error("Role already exists");
    }

    return await Role.create(data);
  }

  public async updateRole(key: string, data: any) {
    const role = await this.findByKey(key);

    if (!role) {
      throw new Error("ROLE NOT FOUND");
    }
    role.merge(data);

    await role.save();

    return role;
  }

  public async disableRole(key: string) {
    const role = await this.findByKey(key);
    if (!role) {
      throw new Error("ROLE NOT FOUND");
    }

    role.status = false;

    await role.save();

    return role;
  }

  public async enableRole(key: string) {
    const role = await this.findByKey(key);

    if (!role) {
      throw new Error("ROLE NOT FOUND");
    }

    role.status = true;

    await role.save();

    return role;
  }
}
