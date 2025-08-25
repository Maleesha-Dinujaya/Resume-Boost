export const GlobalWorkerOptions = { workerSrc: '' };
export const getDocument = () => ({
  promise: Promise.resolve({
    numPages: 0,
    getPage: async () => ({
      getTextContent: async () => ({ items: [] }),
    }),
  }),
});
