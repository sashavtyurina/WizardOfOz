"""
Dump all records from a specified collection to a specified json file.
"""

from pymongo import MongoClient
import json
import sys


# print(client.database_names())  # list all databases available (local, admin, meteor)

def main():

	if (len(sys.argv) != 3): 
		print('Need 2 arguments: collection name, and output file name.')
		return

	client = MongoClient('mongodb://127.0.0.1:3001/meteor')

	collectionName = sys.argv[1]
	outputfilename = sys.argv[2]

	allEvents = client.meteor[collectionName].find({})

	with open(outputfilename, 'w') as fout:
		for doc in allEvents:
			fout.write(json.dumps(doc) + '\n')


if __name__ == "__main__":
    main()