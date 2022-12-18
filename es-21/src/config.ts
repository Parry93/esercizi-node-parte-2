const missingSetting = "Warning: no value set for this variable";

const config = {
  PORT: process.env.PORT || missingSetting,
};

export default config;
