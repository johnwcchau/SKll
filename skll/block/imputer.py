# %%
from skll.block import Block, RunSpec
import pandas as pd
import numpy as np

class ConstantImputer(Block):
    def __init__(self, value:any=0, **kwargs: dict) -> None:
        super().__init__(**kwargs)
        self.value = value

    def dump(self) -> dict:
        r = super().dump()
        r["value"] = self.value
        return r
    
    def run(self, runspec: RunSpec, x, y=None, id=None) -> tuple:
        if not isinstance(x, pd.DataFrame) and not isinstance(x, pd.Series):
            x = pd.DataFrame(x)
        x = x.fillna(self.value)
        return x, y, id

class MethodImputer(Block):
    def __init__(self, method:str="mean", groupby:str=None, **kwargs: dict) -> None:
        super().__init__(**kwargs)
        self.method = method
        self.groupby = groupby

    def __get_v(self, x):
        v = getattr(x, self.method)()
        if hasattr(v, "__getitem__"):
            v = v[0]
        return v

    def dump(self) -> dict:
        r = super().dump()
        r["method"] = self.method
        r["groupby"] = self.groupby
        return r

    def run(self, runspec: RunSpec, x, y=None, id=None) -> tuple:
        if not hasattr(x, self.method):
            raise TypeError(f'input has not method {self.method}')
        if not isinstance(x, pd.DataFrame):
            x = pd.DataFrame(x)
        for col in x.columns:
            if self.groupby and self.groupby in x.columns and self.groupby != col:
                def lamda(x):
                    v = getattr(x, self.method)
                    if hasattr(v, "__getitem__"):
                        v = v[0]
                    x.fillna(v)
                x.loc[:, col] = x.groupby(self.groupby).transform(lambda x: x.fillna(self.__get_v(x)))
            elif not self.groupby or self.groupby != col:
                v = x[col]
                x.loc[:, col] = v.fillna(self.__get_v(v))
        return x, y, id

# %%
if __name__ == "__main__":
    imputer = ConstantImputer(0)
    print(imputer(RunSpec(), pd.DataFrame([[1, np.NaN, 1], [np.NaN, 2, 2], [3, 3, np.NaN]])))
    imputer = MethodImputer()
    print(imputer(RunSpec(), pd.DataFrame([[1, np.NaN, 1], [np.NaN, 2, 2], [3, 3, np.NaN]])))
    imputer = MethodImputer(method="median", groupby=1)
    print(imputer(RunSpec(), pd.DataFrame([
        [1, 1], [1, 1], [2, 1], [2, 1], [2, 1], [np.NaN, 1],
        [1, 2], [1, 2], [1, 2], [2, 2], [2, 2], [np.NaN, 2],])))

# %%