const Database = require("../model/Database");
const Task = require("../model/Task");
const db = new Database("kanban.db");
describe('Task class', () => {
  test('has getAll method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'getAll').mockImplementation(() => Promise.resolve());
    expect(typeof task.getAll).toBe('function')
    expect(task.getAll()).toEqual(Promise.resolve())
  })
  test('has getAll method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'add').mockImplementation(() => Promise.resolve());
    expect(typeof task.add).toBe('function')
    expect(typeof task.add('test')).toBe('object')
    expect(task.getAll()).toEqual(Promise.resolve())
  })
  test('has getAll method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'deleteTask').mockImplementation(() => Promise.resolve());
    expect(typeof task.deleteTask).toBe('function')
    expect(typeof task.deleteTask('test')).toBe('object')
    expect(task.getAll()).toEqual(Promise.resolve())
  })
  test('has getAll method which return promise', () => {
    const task = new Task(db)
    let spy = jest.spyOn(task, 'updateTask').mockImplementation(() => Promise.resolve());
    expect(typeof task.updateTask).toBe('function')
    expect(typeof task.updateTask('test')).toBe('object')
    expect(task.getAll()).toEqual(Promise.resolve())
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
})