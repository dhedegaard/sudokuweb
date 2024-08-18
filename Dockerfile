FROM python:3

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir \
  -r requirements.txt \
  pyright \
  pylint


# Do linting and type checking.
COPY . .
RUN pylint ./*.py && pyright .

CMD [ "python", "./sudokuweb.py" ]
