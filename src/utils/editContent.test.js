import {
  getContentById,
  getPrevContentById,
  getNextContentById,
  getMaxNumPlusOne,
} from "./editContent";

describe("RearrangableTopics", () => {
  const mockData = [
    {
      id: 1,
      title: "First",
      description: "First description",
      content: "Content 1",
      prevId: null,
      nextId: 2,
      key: "1",
    },
    {
      id: 2,
      title: "Second",
      description: "Second description",
      content: "Content 2",
      prevId: 1,
      nextId: null,
      key: "2",
    },
  ];

  test("should get content by id", () => {
    const data = [...mockData];
    const result = getContentById(data, 1);
    expect(result).toEqual(mockData[0]);
  });

  test("should get previous content by id", () => {
    const data = [...mockData];
    const result = getPrevContentById(data, 2);
    expect(result).toEqual(mockData[0]);
  });

  test("should get next content by id", () => {
    const data = [...mockData];
    const result = getNextContentById(data, 1);
    expect(result).toEqual(mockData[1]);
  });

  test("should get max number plus one", () => {
    const nums = [1, 2, 5];
    const result = getMaxNumPlusOne(nums);
    expect(result).toBe(6);
  });
});
