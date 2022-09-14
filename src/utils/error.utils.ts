type ResourceType = "User" | "Doctor" | "Staff" | "Patient";

export class BaseError extends Error {
  constructor(message: string = "Error") {
    super(message);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = "Forbidden") {
    super(message);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = "Not Found") {
    super(message);
  }

  static withId(resourcesType: ResourceType, id: string) {
    return new NotFoundError(`${resourcesType} with id:${id} not found`);
  }
}

export class InvalidError extends BaseError {
  constructor(message: string = "Invalid") {
    super(message);
  }

  static errAlreadyExist(resourcesType: ResourceType, property: string) {
    return new InvalidError(`${resourcesType} with ${property.toLowerCase()} already exist`);
  }

  static errShouldBeUnique(resourcesType: ResourceType, property: string) {
    property = property[0].toUpperCase() + property.slice(1, property.length);
    return new InvalidError(`${property} for ${resourcesType} should be unique`);
  }

  static errPropertyRequired(resourcesType: ResourceType, property: string) {
    property = property[0].toUpperCase() + property.slice(1, property.length);
    return new InvalidError(`${property} is required for ${resourcesType.toLocaleLowerCase()}`);
  }
}
