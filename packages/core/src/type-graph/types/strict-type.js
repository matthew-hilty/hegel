import HegelError from "../../utils/errors";
import { TypeVar } from "./type-var";
import { TypeScope } from "../type-scope";
import { ObjectType } from "./object-type";
import { GenericType } from "./generic-type";

export class $Strict extends GenericType {
  static get name() {
    return "$Strict";
  }

  constructor(_, meta = {}) {
    const parent = new TypeScope(meta.parent);
    super("$Strict", meta, [TypeVar.term("target", { parent })], parent, null);
  }

  isPrincipalTypeFor() {
    return false;
  }

  equalsTo() {
    return false;
  }

  isSuperTypeFor() {
    return false;
  }

  applyGeneric(
    parameters,
    loc,
    shouldBeMemoize = true,
    isCalledAsBottom = false
  ) {
    super.assertParameters(parameters, loc);
    const [target] = parameters;
    const realTarget = target.constraint || target;
    if (!(realTarget instanceof ObjectType)) {
      throw new HegelError("First parameter should be an object type", loc);
    }
    const properties = [...realTarget.properties.entries()];
    return ObjectType.term(
      ObjectType.getName(properties, undefined, false),
      { isSoft: false },
      properties
    );
  }
}
