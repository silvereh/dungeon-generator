class Point(object):
	def __init__(self, x, y):
		self.x = x
		self.y = y
	
	def __eq__(self, rhs):
		return self.x == rhs.x and self.y == rhs.y
	
	def isVerticallyAligned(self, rhs):
		return self.x == rhs.x
		
	def isHorizontallyAligned(self, rhs):
		return self.y == rhs.y
