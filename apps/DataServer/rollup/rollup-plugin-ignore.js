const ignoreBlocksPlugin = () => {
  return {
    name: 'ignore-blocks',
    async transform(code) {
      const ignoreStart = '// #BUILD_IGNORE_START';
      const ignoreEnd = '// #BUILD_IGNORE_END';

      const regex = new RegExp(`${ignoreStart}[\\s\\S]*?${ignoreEnd}`, 'g');
      const transformedCode = code.replace(regex, '');

      return {
        code: transformedCode,
        map: null,
      };
    },
  };
};

export default ignoreBlocksPlugin;