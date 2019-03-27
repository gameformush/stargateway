class CommandCenter {
	constructor(Store, calculator) {
		this.store = Store;
		this.calculator = calculator
	}

	saveStarshipRequest(starship, destSector, path) {
		return process.nextTick(() => {
			this.store.insertRequest(starship, destSector, path);
		});
	}

	getGatewayPath(sector, cb) {
		return new Promise((resolve, reject) => {
			this.calculator.getPaths(sector, (paths) => {
				resolve(paths);
			});
		})
	}

	getStarshipsLastPosition() {
		return this.store.getStarshipsLastPosition();
	}

	getStarshipRequestHistory(starship) {
		return this.store.getStarshipRequestHistory(starship);
	}
}

module.exports = CommandCenter;